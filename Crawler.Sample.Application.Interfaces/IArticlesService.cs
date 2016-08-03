using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Crawler.Sample.Domain.Entity;

namespace Crawler.Sample.Application.Interfaces
{
    public interface IArticlesService
    {
        Task<Articles> Get(int Id);
        Task<bool> GetByUrl(string url);

        Task<bool> Add(Articles article);

        Task<bool> BatchAdd(List<Articles> list);

    }
}
