using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Web.Hosting;
using Crawler.Sample.Application.Interfaces;
using Crawler.Sample.Domain.Entity;
using Crawler.Sample.Infrastructure.IoC.Contracts;
using Crawlwer.Sample.Common;
using log4net;
using Lucene.Net.Analysis.PanGu;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.Store;
using Microsoft.Practices.Unity;

namespace Crawler.Sample.SearchEngine
{
    /// <summary>
    /// 索引管理类
    /// </summary>
    public class IndexManager : Singleton<IndexManager>
    {
        //private static readonly string IndexPath = HostingEnvironment.MapPath("~/Dic");
        private static readonly string IndexPath = WebConfigurationManager.AppSettings["DicPath"];

        private IndexManager()
        { }

        public void Start()
        {
            Thread thread = new Thread(WatchIndexTask);
            thread.IsBackground = true;
            thread.Start();
        }

        private readonly ConcurrentQueue<IndexTask> IndexQueue = new ConcurrentQueue<IndexTask>();
        private void WatchIndexTask()
        {
            while (true)
            {
                if (IndexQueue.Count > 0)
                {
                    // 索引文档保存位置
                    FSDirectory directory = FSDirectory.Open(new DirectoryInfo(IndexPath), new NativeFSLockFactory());
                    bool isUpdate = IndexReader.IndexExists(directory); //判断索引库是否存在
                    if (isUpdate)
                    {
                        //  如果索引目录被锁定（比如索引过程中程序异常退出），则首先解锁
                        //  Lucene.Net在写索引库之前会自动加锁，在close的时候会自动解锁
                        //  不能多线程执行，只能处理意外被永远锁定的情况
                        if (IndexWriter.IsLocked(directory))
                        {
                            IndexWriter.Unlock(directory);  //unlock:强制解锁，待优化
                        }
                    }
                    //  创建向索引库写操作对象  IndexWriter(索引目录,指定使用盘古分词进行切词,最大写入长度限制)
                    //  补充:使用IndexWriter打开directory时会自动对索引库文件上锁
                    IndexWriter writer = new IndexWriter(directory, new PanGuAnalyzer(), !isUpdate,
                        IndexWriter.MaxFieldLength.UNLIMITED);

                    while (IndexQueue.Count > 0)
                    {
                        IndexTask task;
                        IndexQueue.TryDequeue(out task);
                        int id = task.TaskId;
                        Articles article = IocContainer.Default.Resolve<IArticlesService>().Get(id).Result;

                        if (article == null)
                        {
                            continue;
                        }

                        //  一条Document相当于一条记录
                        Document document = new Document();
                        //  每个Document可以有自己的属性（字段），所有字段名都是自定义的，值都是string类型
                        //  Field.Store.YES不仅要对文章进行分词记录，也要保存原文，就不用去数据库里查一次了
                        document.Add(new Field("id", id.ToString(), Field.Store.YES, Field.Index.NOT_ANALYZED));
                        //  需要进行全文检索的字段加 Field.Index. ANALYZED
                        //  Field.Index.ANALYZED:指定文章内容按照分词后结果保存，否则无法实现后续的模糊查询 
                        //  WITH_POSITIONS_OFFSETS:指示不仅保存分割后的词，还保存词之间的距离
                        document.Add(new Field("title", article.Title, Field.Store.YES, Field.Index.ANALYZED,
                            Field.TermVector.WITH_POSITIONS_OFFSETS));
                        document.Add(new Field("content", article.Content, Field.Store.YES, Field.Index.ANALYZED,
                            Field.TermVector.WITH_POSITIONS_OFFSETS));
                        if (task.TaskType != TaskTypeEnum.Add)
                        {
                            //  防止重复索引，如果不存在则删除0条
                            writer.DeleteDocuments(new Term("id", id.ToString()));// 防止已存在的数据 => delete from t where id=i
                        }
                        //  把文档写入索引库
                        writer.AddDocument(document);
                    }

                    writer.Dispose(); // Dispose后自动对索引库文件解锁
                    directory.Dispose();  //  不要忘了Dispose，否则索引结果搜不到
                }
                else
                {
                    Thread.Sleep(2000);
                }
            }
        }

        public void AddArticle(IndexTask task)
        {
            task.TaskType = TaskTypeEnum.Add;
            IndexQueue.Enqueue(task);
        }

        public void UpdateArticle(IndexTask task)
        {
            task.TaskType = TaskTypeEnum.Update;
            IndexQueue.Enqueue(task);
        }
    }

    public class IndexTask
    {
        public int TaskId { get; set; }

        public TaskTypeEnum TaskType { get; set; }
    }

    public enum TaskTypeEnum
    {
        Add,
        Update
    }
}
