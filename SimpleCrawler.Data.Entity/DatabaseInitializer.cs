using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SimpleCrawler.Data.Migrations;

namespace SimpleCrawler.Data
{
    public static class DatabaseInitializer
    {
        /// <summary>
           /// 数据库初始化
           /// </summary>
           public static void Initialize()
           {
               Database.SetInitializer(new Configuration());
               using (var db = new BlogContext())
               {
                   db.Database.Initialize(false);
               }
           }
    }
}
