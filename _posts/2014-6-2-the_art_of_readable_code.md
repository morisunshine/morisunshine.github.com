---
layout: post
title: "《编写可读代码的艺术》读书笔记"
description: "代码应当写的容易理解，这就是为什么要读这本书的原因。代码也是美的，就像文章一样，好的文章能让我们获得很多理念或者想法，并且在阅读的过程中也是那么地愉快与自然。而在编程中，我们大部分时间做的事情并不是在写代码，而是在测试、修改还有阅读，如果连我们自己都不能去更好地理解我们自己写的代码时，那我们又怎么能别人去理解呢，到时他心里一定在臭骂你，虽然你已经与这个项目没有关系，但是如果你想成为一个优秀的程序员，我想你一定不会希望在别人心里是这样的人，当别人用你的产品时，别人看不到背后的代码，但这不意味可以随意写，看不到的事情才是最可怕的，如果我们未来想做一些改动，那么你要做的可能就是重构了，而我们现在大部分意义上的重构，最后也只是变成把以前的代码再重写。"
category: reading
tags: [代码, 笔记]
comments: true
share: true

---

>代码应当写的容易理解

这就是为什么要读这本书的原因。代码也是美的，就像文章一样，好的文章能让我们获得很多理念或者想法，并且在阅读的过程中也是那么地愉快与自然。而在编程中，我们大部分时间做的事情并不是在写代码，而是在测试、修改还有阅读，如果连我们自己都不能去更好地理解我们自己写的代码时，那我们又怎么能别人去理解呢，到时他心里一定在臭骂你，虽然你已经与这个项目没有关系，但是如果你想成为一个优秀的程序员，我想你一定不会希望在别人心里是这样的人，当别人用你的产品时，别人看不到背后的代码，但这不意味可以随意写，看不到的事情才是最可怕的，如果我们未来想做一些改动，那么你要做的可能就是重构了，而我们现在大部分意义上的重构，最后也只是变成把以前的代码再重写。    

我很确定，我还会再读这本书，因为让代码变得可读，并不是你看一遍书，你就能实现的，它需要我们的练习与实践，并且作者也提供了一个很好的方式来检验我们的代码的可读性，找一个朋友去读你这段代码，看他能否理解你这段代码的真实目的。更何况，要将代码写成艺术，这更是需要时间。

>把理解代码所需的时间最小化是一个更好的目标

#表面层次的改进
##把信息塞入名字
这句话的意思就是让阅读者（可能是你也可能是其他人）通过名字就可以获得大量的信息

- 使用专业的单词
- 避免空泛的名字
- 使用具体的名字来细致地描述事物
- 给变量名带上重要的细节
- 为作用域大的名字采用更长的名字
- 有目的地使用大小写、下划线等

##审美
这有点像书或者杂志总的排版，让内容更适合阅读。

- 使用一致的布局，让读者习惯你的代码风格
- 让相似的代码看上去相似，比如类似功能的代码就可以同样的格式，这样就容易让人联想这个功能与那个功能应该是类似的。
- 把相关的代码行分组，形成代码块。
- 一致的风格比“正确”的风格更重要

##注释
注释的目的是尽量帮助读者了解得和作者一样多。

- 不要为那些从代码本身就能快速推断的事实写注释
- 如果你不能一句话写清楚，那就多提供更多细节
- 不要给不好的名字加注释，而是应该把名字改好。这个我之前没有意识到这点。所以还是好名字比一个好注释更重要。
- 记录你的思想，比如就像git中的commit，可以写一些这段代码做的事情，你遇到的坑，这样也能你的思想过程记录下来，对后面的维护也有依据。但是别写的太多。
- 尽量精确地描述函数的行为。

#简化循环和逻辑
>每当你看到一个复杂的逻辑，一个巨大的表达式或者一大推变量，这些都会增加你头脑中的思维包袱。它需要让你考虑得更复杂并且记住更多事情。

##拆分超长的表达式

- 代码中的表达式越长，它就越难以理解。
- 可以增加一个总结变量来代表一段表达式。
- 很多表达式都是一样，那就将它提取出来，作为一个方法---Don't repeat yourself

##变量与可读性

- 变量越多，就越难跟踪它们的动向。
- 变量的作用域越大，就需要跟踪它的动向越久。
- 变量改变得越频繁，就越难以跟踪它的当前值。

#重新组织代码

##抽取不相关的子问题

- 通用代码很好，因为“它完全从项目的其他部分中解耦出”。像这样的代码容易开发，容易测试，并且容易理解。
- 你永远不要安于使用不理想的接口。你总是可以创建你自己的包装函数来隐藏接口的重要细节，让它不再成为你的阻碍。
- 应该把代码组织得一次做一件事。
- 最可读的代码就是没有代码。
- 通过重用库或者减少功能，你可以节省时间并且让你的代码库保持精简节约。

#测试与可读性

- 测试应当具有可读性，以便其他程序员可以舒服地改变或者增加测试。
- 对使用者隐去不重要的细节，以便更重要的细节会更突出。
- 代码时想着测试这件事就能帮助把代码写得更好。
- 解耦合最好的那一个往往就是最容易测试的那个。

#笔记总结

如何将编写代码当做艺术看待，这与我们的追求有关，但是艺术是什么呢，其实就是每天的积累与进步，当我们每天花一些时间去思考这样的命名适不适合，这样的结构合不合理，也许我们也能成为自己代码的艺术家，这真的很像《黑客与画家》中说的手工艺人，“如切如磋 如琢如磨”，正是如此。
