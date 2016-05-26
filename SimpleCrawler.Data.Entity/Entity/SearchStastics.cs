using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimpleCrawler.Data.Entity
{
    /// <summary>
    /// 查询状态
    /// </summary>
    public class SearchStastics
    {
        /// <summary>
        /// 关键词
        /// </summary>
        public string Word { get; set; }

        /// <summary>
        /// 搜索数量
        /// </summary>
        public long SearchCount { get; set; }
    }
}
