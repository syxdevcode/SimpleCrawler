/******************************************************************

* Copyright (C): ***公司

* CLR版本: 4.0.30319.34011

* 命名空间名称: CnblogsArticlesDownLoad.Migrations

* 文件名: Configuration

* GUID1: 1dda308c-4807-440d-ab0d-2b3641deed99

* 创建时间: 2015/9/9 10:20:30

******************************************************************/

using System.Data.Entity;

namespace BlogComm.Migrations
{
    public class Configuration : CreateDatabaseIfNotExists<BlogContext>
    {
        public Configuration()
        {
            //AutomaticMigrationsEnabled = true;
            //AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(BlogContext context)
        {
            //var blogs = new[]
            //{
            //    new CnblogsEntity  {BlogTitle = "My First Blog",AddDateTime = DateTime.Now}
            //};
            //context.CnblogsEntity.AddOrUpdate(blogs);

            //context.SaveChanges();
        }
    }
}