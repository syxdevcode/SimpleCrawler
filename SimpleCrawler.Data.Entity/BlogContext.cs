using System.Data.Entity;
using SimpleCrawler.Data.Entity;

namespace SimpleCrawler.Data
{
    public class BlogContext : DbContext
    {
        public BlogContext()
            : base("name=CnblogsConnectionString")
        {
        }

        public DbSet<ArticleEntity> ArticleEntity { get; set; }

        public DbSet<SearchLog> SearchLog { get; set; }

        public DbSet<SearchResult> SearchResult { get; set; }

        public DbSet<SearchStastics> SearchStastics { get; set; }
    }
}