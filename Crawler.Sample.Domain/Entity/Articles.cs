using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Crawler.Sample.Domain.Entity
{
   public class Articles:IAggregateRoot
    {
        /// <summary>
        /// 主键ID
        /// </summary>
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Key]
        public long Id { get; set; }

        /// <summary>
        /// 标题
        /// </summary>
       [StringLength(1024)]
       public string Title { get; set; }

        /// <summary>
        /// 公网链接地址
        /// </summary>
        [StringLength(1023)]
        public string Url { get; set; }

        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 摘要
        /// </summary>
        [StringLength(1024)]
        public string Summary { get; set; }

        /// <summary>
        /// 添加时间
        /// </summary>
        [StringLength(128)]
        public string AddTime { get; set; }

        /// <summary>
        /// 是否有效
        /// </summary>
        public bool IsDelete { get; set; }


    }
}
