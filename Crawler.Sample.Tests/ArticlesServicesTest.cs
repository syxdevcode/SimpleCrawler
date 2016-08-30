using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Crawler.Sample.Application.Interfaces;
using Crawler.Sample.Domain.Entity;
using Crawler.Sample.Infrastructure.IoC.Contracts;
using Crawlwer.Sample.Common;
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
        public void Add()
        {

            Task task1 = Task.Run(() =>
            {
                for (var i = 0; i < 99999; i++)
                {
                    Articles article = new Articles();
                    article.Id = PrimaryKeyGen.GuidToLongId();
                    article.IsDelete = false;
                    article.Url = "http://codego.net/10158933/" + PrimaryKeyGen.GuidToLongId();
                    article.Title = "cs";
                    article.Content = "测试添加";
                    article.AddTime = DateTime.Now.ToString("yyyyMMddhhmmss");
                    var saveResult = _IArticlesService.Add(article);
                }
            });
            

            Task.WaitAll(task1);


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
