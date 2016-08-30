using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Crawler.Sample.Domain.Entity
{
    public class SearchStastics : IAggregateRoot
    {
        /// <summary>
        /// 主键ID
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// 关键词
        /// </summary>
        [StringLength(512)]
        public string KeyWord { get; set; }

        /// <summary>
        /// 统计
        /// </summary>
        public int Total { get; set; }
    }
}
