using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;
using Crawler.Sample.Domain.Entity;
using Crawlwer.Sample.Common;
using Lucene.Net.Analysis;
using Lucene.Net.Analysis.PanGu;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.QueryParsers;
using Lucene.Net.Search;
using Lucene.Net.Store;

namespace Crawler.Sample.SearchEngine
{
    /// <summary>
    /// 搜索管理类
    /// </summary>
    public class SearchManager : Singleton<SearchManager>
    {
        private SearchManager() { }

        #region 在不同的分类下再根据title和content字段中查询数据(分页)  
        /// <summary>  
        /// 在不同的类型下再根据title和content字段中查询数据(分页)  
        /// </summary>  
        /// <param name="flag">分类,传空值查询全部</param>  
        /// <param name="keyWord"></param>  
        /// <param name="pageIndex"></param>  
        /// <param name="pageSize"></param>  
        /// <param name="totalCount"></param>  
        /// <param name="isLike"></param> 
        /// <returns></returns>  
        public  List<SearchResult> Search(string flag, string keyWord, int pageIndex, int pageSize, out int totalCount, bool isLike = false)
        {
            if (pageIndex < 1) pageIndex = 1;
            BooleanQuery bq = new BooleanQuery();
            if (!string.IsNullOrEmpty(flag))
            {
                QueryParser qpflag = new QueryParser(version, "flag", analyzer);
                Query qflag = qpflag.Parse(flag);
                bq.Add(qflag, Occur.MUST);//与运算  
            }
            if (!string.IsNullOrEmpty(keyWord))
            {
                string[] fileds = { "title", "content" };//查询字段  
                QueryParser parser = null;// new QueryParser(version, field, analyzer);//一个字段查询  
                parser = new MultiFieldQueryParser(version, fileds, analyzer);//多个字段查询  
                Query queryKeyword = parser.Parse(keyWord);
                bq.Add(queryKeyword, Occur.MUST);//与运算  

                if (isLike)
                {
                    Query prefixQuery_title = null;
                    Query prefixQuery_body = null;
                    Query fuzzyQuery_Title = null;
                    Query fuzzyQuery_body = null;
                    Query wildcardQuery_title = null;
                    Query wildcardQuery_body = null;
                    //以什么开头，输入“ja”就可以搜到包含java和javascript两项结果了
                    prefixQuery_title = new PrefixQuery(new Term("title", keyWord));
                    prefixQuery_body = new PrefixQuery(new Term("content", keyWord));
                    //直接模糊匹配,假设你想搜索跟‘wuzza’相似的词语,你可能得到‘fuzzy’和‘wuzzy’。
                    fuzzyQuery_Title = new FuzzyQuery(new Term("title", keyWord));
                    fuzzyQuery_body = new FuzzyQuery(new Term("content", keyWord));
                    //通配符搜索
                    wildcardQuery_title = new WildcardQuery(new Term("title", keyWord));
                    wildcardQuery_body = new WildcardQuery(new Term("content", keyWord));

                    bq.Add(prefixQuery_title, Occur.SHOULD);
                    bq.Add(prefixQuery_body, Occur.SHOULD);
                    bq.Add(fuzzyQuery_Title, Occur.SHOULD);
                    bq.Add(fuzzyQuery_body, Occur.SHOULD);
                    bq.Add(wildcardQuery_title, Occur.SHOULD);
                    bq.Add(wildcardQuery_body, Occur.SHOULD);
                }
            }
            TopScoreDocCollector collector = TopScoreDocCollector.Create(pageIndex * pageSize, false);
            IndexSearcher searcher = new IndexSearcher(directory_luce, true);//true-表示只读  
            searcher.Search(bq, collector);
            if (collector == null || collector.TotalHits == 0)
            {
                totalCount = 0;
                return null;
            }
            else
            {
                int start = pageSize * (pageIndex - 1);
                //结束数  
                int limit = pageSize;
                ScoreDoc[] hits = collector.TopDocs(start, limit).ScoreDocs;
                List<SearchResult> list = new List<SearchResult>();
                int counter = 1;
                totalCount = collector.TotalHits;
                foreach (ScoreDoc sd in hits)//遍历搜索到的结果  
                {
                    try
                    {
                        Document doc = searcher.Doc(sd.Doc);
                        SearchResult searchResult = new SearchResult();
                        searchResult.Id = Convert.ToInt64(doc.Get("id"));
                        string title = doc.Get("title");
                        string content = doc.Get("content");

                        PanGu.HighLight.SimpleHTMLFormatter simpleHTMLFormatter = new PanGu.HighLight.SimpleHTMLFormatter("<font color=\"red\">", "</font>");
                        PanGu.HighLight.Highlighter highlighter = new PanGu.HighLight.Highlighter(simpleHTMLFormatter, new PanGu.Segment());
                        highlighter.FragmentSize = 50;
                        content = highlighter.GetBestFragment(keyWord, content);
                        string titlehighlight = highlighter.GetBestFragment(keyWord, title);
                        if (titlehighlight != "") title = titlehighlight;
                        searchResult.Title = title;
                        searchResult.Content = content;
                        list.Add(searchResult);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }
                    counter++;
                }
                return list;
            }
        }
        #endregion

        #region directory_luce  
        private Lucene.Net.Store.Directory _directory_luce = null;
        /// <summary>  
        /// Lucene.Net的目录-参数  
        /// </summary>  
        public Lucene.Net.Store.Directory directory_luce
        {
            get
            {
                if (_directory_luce == null) _directory_luce = Lucene.Net.Store.FSDirectory.Open(directory);
                return _directory_luce;
            }
        }
        #endregion

        #region directory  
        private System.IO.DirectoryInfo _directory = null;
        /// <summary>  
        /// 索引在硬盘上的目录  
        /// </summary>  
        public System.IO.DirectoryInfo directory
        {
            get
            {
                if (_directory == null)
                {
                    string dirPath = AppDomain.CurrentDomain.BaseDirectory + "Dic";
                    if (System.IO.Directory.Exists(dirPath) == false) _directory = System.IO.Directory.CreateDirectory(dirPath);
                    else _directory = new System.IO.DirectoryInfo(dirPath);
                }
                return _directory;
            }
        }
        #endregion

        #region analyzer  
        private Analyzer _analyzer = null;
        /// <summary>  
        /// 分析器  
        /// </summary>  
        public Analyzer analyzer
        {
            get
            {
                //if (_analyzer == null)  
                {
                    _analyzer = new Lucene.Net.Analysis.PanGu.PanGuAnalyzer();//盘古分词分析器  
                    //_analyzer = new StandardAnalyzer(Lucene.Net.Util.Version.LUCENE_30);//标准分析器  
                }
                return _analyzer;
            }
        }
        #endregion

        #region version  
        private static Lucene.Net.Util.Version _version = Lucene.Net.Util.Version.LUCENE_30;
        /// <summary>  
        /// 版本号枚举类  
        /// </summary>  
        public Lucene.Net.Util.Version version
        {
            get
            {
                return _version;
            }
        }
        #endregion
    }
}
