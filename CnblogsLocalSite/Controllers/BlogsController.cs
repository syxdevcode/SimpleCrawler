using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using BlogComm;
using Webdiyer.WebControls.Mvc;

namespace CnblogsLocalSite.Controllers
{
    public class BlogsController : Controller
    {
        //
        // GET: /Blogs/

        protected readonly BlogDal dal = BlogDal.Instance;

        public ActionResult IndexList(int? id)
        {
            int totalCount = 0;
            int pageIndex = id ?? 1;
            List<CnblogsEntity> list = dal.GegEntitiesPageList("", 20, (pageIndex - 1) * 20, out totalCount);
            PagedList<CnblogsEntity> mPage = list.AsQueryable().ToPagedList(pageIndex, 20);
            mPage.TotalItemCount = totalCount;
            mPage.CurrentPageIndex = (int)(id ?? 1);
            return View(mPage);
        }

        [ValidateInput(true)]
        public ActionResult Index(int? id)
        {
            if (id != null)
            {
                CnblogsEntity entity = dal.GetBlogById(id.Value);
                return View(entity);
            }
            else
            {
                return View(new CnblogsEntity());
            }
        }

        public ActionResult Test()
        {

            return View();
        }

        public ActionResult Test1()
        {
            return View();
        }
    }
}