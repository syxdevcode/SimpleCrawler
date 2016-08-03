using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Crawler.Sample.Domain.Entity;

namespace Crawler.Sample.Application.Interfaces
{
    public interface ISearchStasticsService
    {
        Task<SearchStastics> Get(int Id);

        Task<bool> Add(SearchStastics searchStastics);

        Task<bool> UpdateKeyWord(string keyWord, int total);
    }
}
