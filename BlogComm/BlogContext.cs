using System.Data.Entity;

namespace BlogComm
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