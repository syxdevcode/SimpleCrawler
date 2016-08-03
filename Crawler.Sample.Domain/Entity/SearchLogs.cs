using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Crawler.Sample.Domain.Entity
{
    public class SearchLogs :IAggregateRoot
    {
        /// <summary>
        /// 主键ID
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 搜索内容
        /// </summary>
        [StringLength(128)]
        public string SearchContent { get; set; }

        /// <summary>
        /// 搜索时间
        /// </summary>
        [StringLength(128)]
        public string SearchTime { get; set; }
    }
}
