using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SimpleCrawler.Common;
using SimpleCrawler.Data.Entity;

namespace SimpleCrawler.Data.DAL
{
    /// <summary>
    /// 查询统计
    /// </summary>
    public class SearchStasticsDal : Singleton<SearchStasticsDal>
    {
        private SearchStasticsDal() { }
        /// <summary>
        /// 搜索建议
        /// </summary>
        /// <param name="keyWord"></param>
        /// <returns></returns>
        public List<SearchStastics> SearchSuggestion(string keyWord)
        {
            using (BlogContext context = new BlogContext())
            {
                return context.SearchStastics.Where(p => p.KeyWord.Contains(keyWord)).OrderByDescending(p=>p.SearchCount).ToList();
            }
        }
    }
}
