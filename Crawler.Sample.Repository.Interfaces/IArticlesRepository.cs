using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Crawler.Sample.Domain.Entity;

namespace Crawler.Sample.Repository.Interfaces
{
    public interface IArticlesRepository:IRepository<Articles>
    {
        IQueryable<Articles> GetByName(string name);
    }
}
