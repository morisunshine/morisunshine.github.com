---
layout: post   
title: "Objective-C Runtime"  
description: ""  
category: iOS  
tags: [iOS] 
comments: true 
share: true
---

一、Runtime是什么？

简单来说，Runtime 是支持 Objective-C 实现动态语言特性的灵魂，Objective-C 会尽可能地将一些决定工作从编译阶段和链接阶段推迟到运行阶段，这给我们带来了很大的灵活性，我们可以在运行时去决定把消息转发给我们指定的对象，或者可以随意交互一个方法的实现之类，这也就意味着 Objective-C 需要的不仅是编译器，还需要一个运行系统来执行这些已经编译好的代码，所以 Runtime 对 Objective-C 中来说，扮演的就像是一个操作系统的角色。

二、