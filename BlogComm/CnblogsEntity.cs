/******************************************************************

* Copyright (C): ***公司

* CLR版本: 4.0.30319.34011

* 命名空间名称: CnblogsArticlesDownLoad

* 文件名: CnblogsEntity

* GUID1: 6f7fd735-524b-47cb-b1b3-af77b10097e4

* 创建时间: 2015/9/9 10:23:41

******************************************************************/

using System;

namespace BlogComm
{
    /// <summary>
    /// 博客实体类
    /// </summary>
    public class CnblogsEntity
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