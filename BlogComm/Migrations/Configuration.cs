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