%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\installutil.exe SimpleCrawlerServices.exe
Net Start SimpleCrawlerServices
sc config SimpleCrawlerServices start= auto
::pause