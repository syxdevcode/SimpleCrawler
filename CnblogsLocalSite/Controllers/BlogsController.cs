using BlogComm;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Webdiyer.WebControls.Mvc;

namespace CnblogsLocalSite.Controllers
{
    public class BlogsController : Controller
    {
        protected readonly BlogDal dal = BlogDal.Instance;

        public ActionResult IndexList(int? id)
        {
            int totalCount = 0;
            int pageIndex = id ?? 1;
            List<ArticleEntity> list = dal.GegEntitiesPageList("", 20, (pageIndex - 1) * 20, out totalCount);
            PagedList<ArticleEntity> mPage = list.AsQueryable().ToPagedList(pageIndex, 20);
            mPage.TotalItemCount = totalCount;
            mPage.CurrentPageIndex = (int)(id ?? 1);
            return View(mPage);
        }

        [ValidateInput(true)]
        public ActionResult Index(int? id)
        {
            if (id != null)
            {
                ArticleEntity entity = dal.GetBlogById(id.Value);
                return View(entity);
            }
            else
            {
                return View(new ArticleEntity());
            }
        }

        public ActionResult Test()
        {
            return View();
        }
    }
}