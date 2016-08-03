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
    public class SearchResultRepository : BaseRepository<SearchResult>, ISearchResultRepository
    {
        public SearchResultRepository(IDbContext dbContext) : base(dbContext)
        { }
    }
}
