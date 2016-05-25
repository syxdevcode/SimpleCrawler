using System;
using System.Data.Entity;
using System.Data.Entity.Migrations;

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
            //    new ArticleEntity  {BlogTitle = "My First Blog",AddDateTime = DateTime.Now}
            //};
            //context.ArticleEntity.AddOrUpdate(blogs);

            //context.SaveChanges();
        }
    }
}