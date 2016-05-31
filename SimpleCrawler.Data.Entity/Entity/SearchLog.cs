using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimpleCrawler.Data.Entity
{
    /// <summary>
    /// 搜索日志表
    /// </summary>
    public class SearchLog
    {
        /// <summary>
        /// 主键ID
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// 关键词
        /// </summary>
        public string Word { get; set; }

        /// <summary>
        /// 搜索时间
        /// </summary>
        public DateTime SearchDate { get; set; }
    }
}
