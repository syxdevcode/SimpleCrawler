using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Crawler.Sample.Domain.Entity;

namespace Crawler.Sample.Application.Interfaces
{
   public interface ISearchLogsService
   {
       Task<SearchLogs> Get(int Id);

       Task<bool> Add(SearchLogs searchLogs);

        //Task<IQueryable<SearchLogs>> GetByCondition(Expression<Func<,bool>> )
   }
}
