/******************************************************************

* Copyright (C): ***公司

* CLR版本: 4.0.30319.34011

* 命名空间名称: CnblogsArticlesDownLoad

* 文件名: BrowserCollection

* GUID1: e452e5de-183d-4201-980c-16980095efc2

* 创建时间: 2015/9/17 8:57:20

******************************************************************/

using System;
using System.Collections.Generic;
using System.IO;

namespace CnblogsArticlesDownLoad
{
    /// <summary>
    /// 获取到IE浏览器收藏栏中链接
    /// </summary>
    public class BrowserCollection
    {
        public List<string> GetBrowserCollectionsUrl()
        {
            string FavoritePath = System.Environment.GetFolderPath(System.Environment.SpecialFolder.Favorites);
            List<string> list = LoadLinkFolders(new System.IO.DirectoryInfo(FavoritePath));
            return list;
        }

        /// <summary>
        /// 遍历系统收藏夹目录中所有链接网址
        /// </summary>
        /// <param name="ParentFolder"></param>
        private List<string> LoadLinkFolders(DirectoryInfo ParentFolder)
        {
            //string ParentFolderName = ParentFolder.Name;
            List<string> listUrl = new List<string>();

            foreach (FileInfo SubFile in ParentFolder.GetFiles())
            {
                string strCurrentLinkUrl = GetLinkFileUrl(SubFile.FullName);
                listUrl.Add(strCurrentLinkUrl);
                //Console.WriteLine("当前文件" + SubFile.FullName + "链接网址为" + strCurrentLinkUrl);
            }
            foreach (DirectoryInfo SubFolder in ParentFolder.GetDirectories())
            {
                try
                {
                    listUrl.AddRange(LoadLinkFolders(SubFolder));
                }
                catch (Exception)
                {
                    Console.WriteLine("读取当前文件夹" + SubFolder.FullName + "收藏网址失败!");
                }
            }
            return listUrl;
        }

        /// <summary>
        /// 根据收藏夹URL文件获取对应的链接网址
        /// </summary>
        /// <param name="linkFilePath"></param>
        /// <returns></returns>
        private string GetLinkFileUrl(string linkFilePath)
        {
            string strReturn = "";
            //异常检测开始
            try
            {
                FileStream fs = new FileStream(linkFilePath, FileMode.Open, FileAccess.Read);//读取文件设定
                StreamReader myStreamReader = new StreamReader(fs, System.Text.Encoding.Default);//设定读写的编码
                //使用StreamReader类来读取文件
                myStreamReader.BaseStream.Seek(0, SeekOrigin.Begin);
                string strLine = myStreamReader.ReadLine();
                while (strLine != null)
                {
                    if (strLine.IndexOf("URL=") == 0)
                    {
                        strReturn = strLine.Replace("URL=", "");
                        break;
                    }
                    strLine = myStreamReader.ReadLine();
                }
                //关闭此StreamReader对象
                myStreamReader.Close();
            }
            catch
            {
                strReturn = "";
            }
            return strReturn;
        }
    }
}