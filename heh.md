July 21st, 2014

Sitecore introduced SPEAK a while back. The main aim is to provide a robust framework that aids in rapid Sitecore module development. But does it really do that? Or was Sheer UI good enough?

In my opinion, the only way we can answer that, is by developing the same module using both Sheer and SPEAK. In this post I will highlight some key differences between the two with the help of _**[Scheduled Task Helper](https://marketplace.sitecore.net/en/Modules/Scheduled_Task_Helper.aspx "Scheduled Task Helper")**_, a module that I had originally built using Sheer for Sitecore 6 and upgraded to use SPEAK for Sitecore 7.2 and up.

Scheduled Task Helper is a module lets you manually run a Sitecore task defined under /system/Tasks node or an agent defined in the Sitecore config. It is useful for both developers and site administrators. Developers can run a scheduled task at the push of a button to debug it. No need to wait for the task to trigger. Site administrators can run a task if for some reason it did not run on schedule.  
  
After developing the module I realized that the two approaches have very little in common. My modules not only looks different, the underlining code is very different. I do not remember how much time I spent learning Sheer UI, but I believe it was definitely more than a day. Even today I have to use Reflector and scavenge through Sitecore directories to look for examples. The lack of documentation does not make it easy.  
SPEAK, however, is different. I did spend a lot of time initially, but the documentation helps. And after I built my first module I could build the second within hours. The one concern I have is that SPEAK has changed quite a bit from what it was in 7.0. This has resulted in some out dated blogs and videos. This could lead to some confusion.

Developing the Sheer version of the module was much slower. Just the UI definition in the Sheer version took hours as I had to define the UI in a XML file. The XML code is not easy. The only way to get it right was to look for a similar control that Sitecore has already built.  
[  
**_Review the code_**  
](https://github.com/niketashesh/ScheduledTaskHelper/blob/master/XCore.ScheduledTaskHelper/sitecore%20modules/XCore%20Tools/XCoreScheduledTaskHelper.xml)  
While for the SPEAK version I only had to select some components and configure some attributes using Sitecore Rocks’ SPEAK layout designer.

![](https://www.xcentium.com/-/media/images/blog-images/sitecore-sheer-ui-to-speak/1.png?rev=61f85094e8c346e4bd98e1bfbe69146c&hash=87AD53841BE16D8B86AF6B17425A100D)

Once I had the correct set of components added. The page was ready to go.

You can download the package or code from the following links (Note: the package will install but the Sheer UI and SPEAK version):  
_**[Download Package](https://marketplace.sitecore.net/en/Modules/Scheduled_Task_Helper.aspx "Download Package"), [Download Source](https://github.com/niketashesh/ScheduledTaskHelper "Download Source")**_

Finally, SPEAK is much easier to debug. By simply appending ?sc\_debug=1 to the URL I was able to access all my controls, test my controller and quickly review JSON data returned. I actually wrote the code on the console before creating my PageCode – a JavaScript file. 

![](https://www.xcentium.com/-/media/images/blog-images/sitecore-sheer-ui-to-speak/2.png?rev=5180f141e73a435dbf77c547f31562ae&hash=742CC2058BF0BD7897A8D3E61E70055D)

**In conclusion I think Sitecore has aptly named SPEAK – Sitecore Process Enablement and Acceleration Kit.** The following table summarizes my findings and observations

| Sheer UI | SPEAK |
| --- | --- |
| Applications UI is built using [XML Controls](http://sdn.sitecore.net/Articles/XML%20Sheer%20UI/Beginning%20with%20XML%20controls.aspx). XAML (eXtensible Application Markup Language, pronounced as ‘zaml’) | A ton of controls are already built in. It’s just a matter of choosing the correct one. But if a custom layout is needed its MVC, HTML 5; much similar to building Sitecore layouts and renderings. |
| Back-end intense, much of the code needs to be written in C# files | Supports Backbone, Knockout, and a hybrid (default) approach |
| Not enough documentation | Lots of documentation, but one major concern is that as SPEAK is evolving into a better product some older documents might lead to confusion |
| Does not require Sitecore Rocks | It requires Sitecore Rocks, but it is a good thing. Life is much easier. You can easily find components attach them to item layouts etc. |
| Old look and feel | Cleaner, simpler UI. |
|  | Launchpad. This is a brilliant idea. It makes accessing applications so much faster. |
| ![](https://www.xcentium.com/-/media/images/blog-images/sitecore-sheer-ui-to-speak/3.png?rev=214d86d48e8c4640a0970581a695350d&hash=10517D93E9CD122849F3D21E88D779FD)  
 | ![](https://www.xcentium.com/-/media/images/blog-images/sitecore-sheer-ui-to-speak/4.png?rev=9f4360a788264da4a17235735202dd5e&hash=3028B0371274C1D9B1BD15DFBD44A3A5)  
 |

You can download the package or code from the following links (Note: the package will install but the Sheer UI and SPEAK version):  
_**[Download Package](https://marketplace.sitecore.net/en/Modules/Scheduled_Task_Helper.aspx "Download Package"), [Download Source](https://github.com/niketashesh/ScheduledTaskHelper "Download Source")**_