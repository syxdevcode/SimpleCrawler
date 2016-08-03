using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Crawler.Sample.Domain.Entity;
using Crawler.Sample.Infrastructure.Interfaces;

namespace Crawler.Sample.Infrastructure
{
    public class ArticleDbContext : DbContext, IDbContext
    {
        public ArticleDbContext() : base("name=default")
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Articles>();
            modelBuilder.Entity<SearchLogs>();
            modelBuilder.Entity<SearchResult>();
            modelBuilder.Entity<SearchStastics>();

            base.OnModelCreating(modelBuilder);
        }
    }
}
