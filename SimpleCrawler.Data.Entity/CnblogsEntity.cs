using System;

namespace SimpleCrawler.Data.Entity
{
    /// <summary>
    /// 博客实体类
    /// </summary>
    public class ArticleEntity
    {
        /// <summary>
        /// 主键ID
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// 博客标题
        /// </summary>
        public string BlogTitle { get; set; }

        /// <summary>
        /// 博客URl
        /// </summary>
        public string BlogUrl { get; set; }

        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 添加时间
        /// </summary>
        public DateTime AddDateTime { get; set; }
    }
}