---
layout: post  
title: "ReactiveCocoa学习笔记"  
category: iOS   
tags: [iOS, 技术]  

---

&nbsp;&nbsp;&nbsp;&nbsp;[**什么是FRP**](#introduce_FRP)  
&nbsp;&nbsp;&nbsp;&nbsp;[**介绍RAC**](#introduce_RAC)  
&nbsp;&nbsp;&nbsp;&nbsp;[**基本框架**](#Framework)  
&nbsp;&nbsp;&nbsp;&nbsp;[**重要概念**](#important_idea)  
&nbsp;&nbsp;&nbsp;&nbsp;[**基本操作**](#basic_operator)  

ReactiveCocoa（其简称为RAC）是实现[Functional Reactive Programming](http://en.wikipedia.org/wiki/Functional_reactive_programming)的iOS新框架，在[Raywenderlich](http://www.raywenderlich.com/)的一个[天气应用的教程](http://www.raywenderlich.com/55384/ios-7-best-practices-part-1)里，我第一次接触到了它，教程中虽然没有过多介绍，但只说了一点，我觉得非常有概括性 --- **your code can react to nondeterministic events**(你的代码能对不确定事件做出反应)。

<a id='introduce' name='introduce_FRP'> </a>
##什么是FRP?



---