using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Crawler.Sample.Domain;
using Crawler.Sample.Infrastructure.Interfaces;
using Crawler.Sample.Repository.Interfaces;

namespace Crawler.Sample.Repository
{
    public abstract class BaseRepository<TAggregateRoot>: IRepository<TAggregateRoot> where TAggregateRoot:class,IAggregateRoot
    {
        public readonly IQueryable<TAggregateRoot> _entities;

        public BaseRepository(IDbContext dbContext)
        {
            _entities = dbContext.Set<TAggregateRoot>();
        }

        public IQueryable<TAggregateRoot> Get(long Id)
        {
            return _entities.Where(t => t.Id == Id);
        }

        public IQueryable<TAggregateRoot> GetAll()
        {
            return _entities;
        }
    }
}
