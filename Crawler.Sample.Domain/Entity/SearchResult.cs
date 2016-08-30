using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Crawler.Sample.Domain.Entity
{
    public class SearchResult:IAggregateRoot
    {
        /// <summary>
        /// 主键ID
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// 内网搜索链接
        /// </summary>
        [StringLength(1024)]
        public string IntraNetUrl { get; set; }

        /// <summary>
        /// 外网搜索链接
        /// </summary>
        [StringLength(1024)]
        public string ExtraNetUrl { get; set; }

        /// <summary>
        /// 标题
        /// </summary>
        [StringLength(1024)]
        public string Title { get; set; }

        /// <summary>
        /// 内容
        /// </summary>
        [StringLength(1024)]
        public string Content { get; set; }
    }
}
