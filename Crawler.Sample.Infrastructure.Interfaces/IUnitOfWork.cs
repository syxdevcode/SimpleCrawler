using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Crawler.Sample.Infrastructure.Interfaces
{
    public interface IUnitOfWork
    {
        void RegisterNew<TEntity>(TEntity entity) where TEntity : class;

        void RegisterDirty<TEntity>(TEntity entity) where TEntity : class;

        void RegisterClean<TEntity>(TEntity entity) where TEntity : class;

        void RegisterDeleted<TEntity>(TEntity entity) where TEntity : class;

        Task<bool> CommitAsync();
        bool Commit();

        void RollBack();
    }
}
