using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Crawler.Sample.Application.Interfaces;
using Crawler.Sample.Domain.Entity;
using Crawler.Sample.Infrastructure.IoC.Contracts;
using Microsoft.Ajax.Utilities;
using Microsoft.Practices.Unity;
using PagedList;

namespace Crawler.Sample.Web.Controllers
{
    public class HomeController : Controller
    {
        private IArticlesService _IArticlesService = IocContainer.Default.Resolve<IArticlesService>();

        public async  Task<ActionResult> Index(int? page)
        {
            int pageIndex = page ?? 1;
            int pageSize = 20;
            
            Stopwatch watch = new Stopwatch();
            watch.Start();//调用方法开始计时
            var memberViews = await _IArticlesService.GetPage(pageIndex, pageSize);
            var personsAsIPagedList = new StaticPagedList<Articles>(memberViews.Item2, pageIndex, pageSize, memberViews.Item1);
            watch.Stop();//调用方法计时结束
            double time = watch.Elapsed.TotalSeconds;//总共花费的时间
            ViewBag.Time = time;
            ViewBag.Count = memberViews.Item1;
            return View(personsAsIPagedList);
        }

        public async Task<ActionResult> Detail(long Id)
        {
            var memberViews = await _IArticlesService.Get(Id);
            return View(memberViews);
        }

        public ActionResult Search(string id = "", string kw = "", string isLike = "0", int pageIndex = 1)
        {
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}