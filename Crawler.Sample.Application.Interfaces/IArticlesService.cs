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
        Task<Articles> Get(long Id);

        Task<Tuple<int, IEnumerable<Articles>>> GetPage(int pageIndex, int pageSize);

        bool GetByUrl(string url);

        bool Add(Articles article);

        Task<bool> BatchAdd(List<Articles> list);

    }
}
