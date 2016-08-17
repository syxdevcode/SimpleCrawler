using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Crawler.Sample.Web.Startup))]
namespace Crawler.Sample.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
