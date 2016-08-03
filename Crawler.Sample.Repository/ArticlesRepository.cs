using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Crawler.Sample.Domain.Entity;
using Crawler.Sample.Infrastructure.Interfaces;
using Crawler.Sample.Repository.Interfaces;

namespace Crawler.Sample.Repository
{
    public class ArticlesRepository:BaseRepository<Articles>,IArticlesRepository
    {
        public ArticlesRepository(IDbContext dbContext) : base(dbContext)
        {
        }

        public IQueryable<Articles> GetByName(string name)
        {
            return _entities.Where(x => x.Title.Contains(name) && x.IsDelete == false);
        }
    }
}
