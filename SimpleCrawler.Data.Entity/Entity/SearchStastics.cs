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
        /// 主键ID
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// 关键词
        /// </summary>
        public string KeyWord { get; set; }

        /// <summary>
        /// 搜索数量
        /// </summary>
        public long SearchCount { get; set; }
    }
}
