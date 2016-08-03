using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Crawler.Sample.Application;
using Crawler.Sample.Application.Interfaces;
using Crawler.Sample.Infrastructure;
using Crawler.Sample.Infrastructure.Interfaces;
using Crawler.Sample.Infrastructure.IoC.Contracts;
using Crawler.Sample.Repository;
using Crawler.Sample.Repository.Interfaces;
using Microsoft.Practices.Unity;

namespace Crawler.Sample.BootStrapper
{
    public class Startup
    {
        public static void Configure()
        {
            UnityContainer register = IocContainer.Default;
            register.RegisterType<IUnitOfWork, UnitOfWork>();
            register.RegisterType<IDbContext, ArticleDbContext>(new PerThreadLifetimeManager());

            register.RegisterType<IArticlesRepository, ArticlesRepository>();
            register.RegisterType<ISearchLogsRepository, SearchLogsRepository>();
            register.RegisterType<ISearchResultRepository, SearchResultRepository>();
            register.RegisterType<ISearchStasticsRepository, SearchStasticsRepository>();

            register.RegisterType<IArticlesService, ArticleService>();
            //register.RegisterType<ISearchLogsService, SearchLogsService>();
        }
    }
}
