using System.Collections.Generic;
using System.Linq;

namespace BlogComm
{
    public class BlogDal:Singleton<BlogDal>
    {
        private BlogDal()
        {
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