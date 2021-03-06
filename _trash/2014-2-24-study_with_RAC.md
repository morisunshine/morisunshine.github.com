---
layout: post  
title: "ReactiveCocoa与函数式响应型编程(FRP)"  
category: iOS   
tags: [iOS, 技术]  

---

虽然现在ReactiveCocoa已经不是什么新鲜事儿了，但是对于RAC中的很多方法都不是理解，为什么要取这样的名字，为什么要这样去实现，所以我想要找到原因，还是要从函数式反应型编程入手。

#什么是函数式反应编程?

## 什么是响应型编程？   

```
a = 2   
b = 2
c = a + b // c is 4

b = 3
// now what is the value of c?
   
```

在一般的情况下，`c`的值会一直是4。但在响应式编程中，情况就不一样了，`c`的值就会随着`b`的值变化而变化。比较直观的例子就是，使用google时，推荐的关键词会随着你的输入框中关键词的改变而改变。

也就是说，在响应式编程中，数据流的变化才是我们关心的，而对数据流发生影响的外因，我们就不需要管。

## 什么是函数式编程？
 
简单说，"函数式编程"是一种"编程范式"（programming paradigm），也就是如何编写程序的方法论。
它属于"结构化编程"的一种，主要思想是把运算过程尽量写成一系列嵌套的函数调用。举例来说，现在有这样一个数学表达式：

```
　　(1 + 2) * 3 - 4
　　
```

传统的过程式编程，可能这样写：

```
　　var a = 1 + 2;
　　var b = a * 3;
　　var c = b - 4;
```
函数式编程要求使用函数，我们可以把运算过程定义为不同的函数，然后写成下面这样：

```
　　var result = subtract(multiply(add(1,2), 3), 4); 
```

## 函数式反应编程(FRP)

从对上面两种编程的认识，我们应该能大概知道，函数式反应编程是通过函数式编程的思想和方法来支持响应式编程。在FRP中最根本的自变量就是时间，而那些对外部环境具有反应能力、随着时间变化的数据被抽象成一种叫信号的概念。这是FRP中最重要也是最基础的概念。

---

#ReactiveCocoa中的基本组件与FRP的对应关系



