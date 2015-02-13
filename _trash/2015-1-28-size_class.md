---
layout: post   
title: "认识iOS8 新特性--Size Class"  
description: "从iOS6开始，苹果就已经推出了AutoLayout，方便开发者去做适配更多屏幕，但是AutoLayout对开发者来说的确是一个煎熬，所以直到现在大部分的开发者还是对这个话题很避讳，更愿意用固定的布局方式。"  
category: iOS  
tags: [iOS]  
comments: true 
share: true
---

从iOS6开始，苹果就已经推出了AutoLayout，方便开发者去做适配更多屏幕，但是AutoLayout对开发者来说的确是一个煎熬，所以直到现在大部分的开发者还是对这个话题很避讳，更愿意用固定的布局方式。
随着iPhone6的上市，让我们不得不去面对适配的问题。因为现在已经有4个屏幕尺寸（如果你还要适配iPad的话，那么就是5个了。），这使得我们必须在开始的时候就要去考虑到适配多屏幕。

关于AutoLayout的教程已经有很多了，今天我想讲的是iOS8中的新特性，`Size Class`，它的到来让我们更加简化了我们的适配工作，或者说让我们的工作轻松了。

![图片](/images/2015-1-28-1.png)

在最新的XCode6中，当你创建一个新的xib或storyboard的时候，你有没有发现这个新的ViewController都是默认打开了Size Classes这个选项，这个小选项就是今天要讲的主题了。

我们现在发现打开Size Classes开关的情况下，我们的ViewController视图默认变成了600px * 600px。并且多出了![图片](/images/2015-1-28-2.png)，这些都是关键。让我们一个个解释这些改变的作用。

##什么是Size Class？

Size Class 是对不同尺寸屏幕的设备已经它们的横竖屏情况进行分类，并且针对这些分类，我们可以在每个分类做不同的事情，比如布局，和添加约束。也就是解决了我们之前为一个页面创建多个xib的情况，这样通过一个xib就能实现对9种类型的屏幕了。

![图片](/images/2015-1-28-3.png)



##参考文章

[Beginning Adaptive Layout Tutorial](http://www.raywenderlich.com/83276/beginning-adaptive-layout-tutorial)

[SIZE CLASSES WITH XCODE 6: ONE STORYBOARD FOR ALL SIZES](http://www.learnswift.io/blog/2014/6/12/size-classes-with-xcode-6-and-swift)

[What's new in iOS](https://developer.apple.com/library/prerelease/ios/releasenotes/General/WhatsNewIniOS/Articles/iOS8.html#//apple_ref/doc/uid/TP40014205-SW1)

[ADAPTIVE LAYOUTS FOR iPHONE 6](http://mathewsanders.com/designing-adaptive-layouts-for-iphone-6-plus/)
