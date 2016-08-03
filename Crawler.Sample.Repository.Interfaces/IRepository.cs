using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Crawler.Sample.Domain;

namespace Crawler.Sample.Repository.Interfaces
{
    public interface IRepository<TAggregateRoot> where TAggregateRoot : class, IAggregateRoot
    {
        IQueryable<TAggregateRoot> Get(int id);

        IQueryable<TAggregateRoot> GetAll();
    }
}
