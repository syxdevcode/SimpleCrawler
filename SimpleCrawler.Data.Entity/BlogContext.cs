using System.Data.Entity;

namespace SimpleCrawler.Data.Entity
{
    public class BlogContext : DbContext
    {
        public BlogContext()
            : base("name=CnblogsConnectionString")
        {
        }

        public DbSet<ArticleEntity> ArticleEntity { get; set; }
    }
}