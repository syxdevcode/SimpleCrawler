using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Crawler.Sample.Application.Interfaces;
using Crawler.Sample.Infrastructure.IoC.Contracts;
using Microsoft.Practices.Unity;
using Xunit;

namespace Crawler.Sample.Tests
{
    public class ArticlesServicesTest
    {
        private IArticlesService _IArticlesService;

        public ArticlesServicesTest()
        {
            Crawler.Sample.BootStrapper.Startup.Configure();
            _IArticlesService = IocContainer.Default.Resolve<IArticlesService>();
        }

        [Fact]
        public async Task Get()
        {
            var article = await _IArticlesService.Get(1);
            Assert.NotNull(article);
            Console.WriteLine("1111");
        }
        [Fact]
        public async Task GetAll()
        {
            var article = await _IArticlesService.Get(1);
            Assert.NotNull(article);
            Console.WriteLine(article.Title);
        }
    }
}
