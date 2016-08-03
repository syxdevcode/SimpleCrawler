using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Crawler.Sample.Domain.Entity;

namespace Crawler.Sample.Application.Interfaces
{
    public interface ISearchResultService
    {
        Task<SearchResult> Get(int Id);

        Task<bool> Add(SearchResult searchResult);
    }
}
