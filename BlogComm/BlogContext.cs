/******************************************************************

* Copyright (C): ***公司

* CLR版本: 4.0.30319.34011

* 命名空间名称: CnblogsArticlesDownLoad

* 文件名: BlogContext

* GUID1: dace5206-523c-4baa-bda7-96c2ae294e6d

* 创建时间: 2015/9/9 10:22:33

******************************************************************/

using System.Data.Entity;

namespace BlogComm
{
    public class BlogContext : DbContext
    {
        public BlogContext()
            : base("name=CnblogsConnectionString")
        {
        }

        public DbSet<CnblogsEntity> CnblogsEntity { get; set; }
    }
}