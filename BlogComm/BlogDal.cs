/******************************************************************

* Copyright (C): ***公司

* CLR版本: 4.0.30319.34011

* 命名空间名称: CnblogsArticlesDownLoad

* 文件名: BlogDal

* GUID1: cf09763c-cf2f-4d2b-8ddc-d1795380db65

* 创建时间: 2015/9/14 20:42:36

******************************************************************/

using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace BlogComm
{
    public class BlogDal
    {

        private static volatile BlogDal instance;

        private static object syncRoot = new object();

        private BlogDal() { }

        public static BlogDal Instance
        {
            get
            {
                if (Instance == null)
                {
                    lock (syncRoot)
                    {
                        if(Instance==null)
                            instance = new BlogDal();
                    }
                }
                return instance;
            }
        }

        /// <summary>
        /// 增加
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public int AddBlog(CnblogsEntity entity)
        {
            using (BlogContext context = new BlogContext())
            {
                context.CnblogsEntity.Add(entity);
                return context.SaveChanges();
            }
        }
        /// <summary>
        /// 批量增加
        /// </summary>
        /// <param name="list"></param>
        /// <returns></returns>
        public int BatchAddBlog(List<CnblogsEntity> list)
        {
            using (BlogContext context = new BlogContext())
            {
                foreach (var item in list)
                {
                    context.CnblogsEntity.Add(item);
                }
                return context.SaveChanges();
            }
        }

        /// <summary>
        /// 查询
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public CnblogsEntity GetBlog(string url)
        {
            using (BlogContext context = new BlogContext())
            {
                var entity = context.CnblogsEntity.FirstOrDefault(b => b.BlogUrl == url);
                return entity;
            }
        }

        /// <summary>
        /// 查询
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public CnblogsEntity GetBlogById(int id)
        {
            using (BlogContext context = new BlogContext())
            {
                var entity = context.CnblogsEntity.FirstOrDefault(b => b.Id == id);
                return entity;
            }
        }

        /// <summary>
        /// 分页方法
        /// </summary>
        /// <returns></returns>
        public List<CnblogsEntity> GegEntitiesPageList(string titleName, int pageSize, int pageIndex, out int totalCount)
        {
            using (BlogContext context = new BlogContext())
            {
                var list = context.CnblogsEntity.Where(n => n.BlogTitle.Contains(titleName)).OrderByDescending(p => p.AddDateTime);
                totalCount = list.Count();
                return list.ToList();
            }
        }
    }
}