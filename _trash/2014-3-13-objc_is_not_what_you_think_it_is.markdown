---
layout: post  
title: "Objective-C不是你想的那样"  
category: iOS   
tags: [iOS, ruby]  

---

Ruby 和 Objective-C 这两种语言看上去好像天南地北:一种是动态语言，另一种则是静态语言;一种是解释型语言，另一种是编译型语言；一种有简洁的语法，另一种则是有点冗长的语法。从优雅的角度来看，Ruby似乎更能给我们一种自由的编程体验，所以很多人都放弃了Objective-C。

但这是一个不幸的笑话。Objective-C其实并不像别人认为的那样是件紧身衣，它和Ruby一样都受Smalltalk影响，它拥有很多Ruby开发者都喜爱的语言功能–动态方法查找、鸭子类型、开放的类和通常情况下高度可变的runtime等这些功能在Objective-C中同样存在，即使那些不出名的技术也是一样。Objective-C的这些功能都要归功于它的IDE和编译器，但也是因为它们才使你不能自由地编写代码。

但是等一下，怎么能说Objective-C是动态语言呢？难道它不是建立在C语言的基础上？

你可以在Objective-C代码中包含任何C或C++的代码，但这不意味着Objective-C仅限于C或C++代码。Objective-C中所有有意思的类操作和对象内省都是来自于一个叫Objective-C Runtime的东西。这个Objective-C Runtime可以和Ruby解释器相媲美。它包含了强大的元编程里所需要的所有重要特性。