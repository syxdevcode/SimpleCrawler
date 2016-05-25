using System.Collections.Generic;
using System.Linq;

namespace BlogComm
{
    public class BlogDal : Singleton<BlogDal>
    {
        private BlogDal()
        {
        }

        /// <summary>
        /// 增加
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public int AddBlog(ArticleEntity entity)
        {
            using (BlogContext context = new BlogContext())
            {
                context.ArticleEntity.Add(entity);
                return context.SaveChanges();
            }
        }

        /// <summary>
        /// 批量增加
        /// </summary>
        /// <param name="list"></param>
        /// <returns></returns>
        public int BatchAddBlog(List<ArticleEntity> list)
        {
            using (BlogContext context = new BlogContext())
            {
                foreach (var item in list)
                {
                    context.ArticleEntity.Add(item);
                }
                return context.SaveChanges();
            }
        }

        /// <summary>
        /// 查询
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public ArticleEntity GetBlog(string url)
        {
            using (BlogContext context = new BlogContext())
            {
                var entity = context.ArticleEntity.FirstOrDefault(b => b.BlogUrl == url);
                return entity;
            }
        }

        /// <summary>
        /// 查询
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ArticleEntity GetBlogById(int id)
        {
            using (BlogContext context = new BlogContext())
            {
                var entity = context.ArticleEntity.FirstOrDefault(b => b.Id == id);
                return entity;
            }
        }

        /// <summary>
        /// 分页方法
        /// </summary>
        /// <returns></returns>
        public List<ArticleEntity> GegEntitiesPageList(string titleName, int pageSize, int pageIndex, out int totalCount)
        {
            using (BlogContext context = new BlogContext())
            {
                var list = context.ArticleEntity.Where(n => n.BlogTitle.Contains(titleName)).OrderByDescending(p => p.AddDateTime);
                totalCount = list.Count();
                return list.ToList();
            }
        }
    }
}