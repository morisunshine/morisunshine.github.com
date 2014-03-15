---
layout: post  
title: "Objective-C不是你想的那样"  
category: iOS   
tags: [iOS, ruby]  

---

Ruby and Objective-C look like opposites: one is dynamic, the other's static; one is interpreted and the other's compiled; one has concise syntax and the other [isALittle wordierInIts:syntacticStyle]. Aesthetics aside, Ruby seems to afford you a freedom of expression that you give up with Objective-C.

Ruby 和 Objective-C 这两种语言看上去好像天南地北：一种是动态语言，另一种则是静态语言；一种是解释型语言，另一种是编译型语言；一种有简洁的语法，另一种则是有点冗长的语法。从优雅的角度来看，Ruby似乎更能给我们一种自由的编程体验，所以很多人都放弃了Objective-C。

---

But that's an unfortunate caricature. Objective-C is no straightjacket; it is, like Ruby, a descendant of Smalltalk, and many of the language features beloved by Rubyists — dynamic method lookup, duck typing, open classes, and in general a highly mutable runtime — are also available in Objective-C, even if some of these techniques are less well-known. And it does it all with an IDE and compiler that keep your worst instincts in check.

但这是一个不幸的笑话。Objective-C其实并不像别人认为的那样是件紧身衣，它和Ruby一样都受Smalltalk影响，它拥有很多Ruby开发者都喜爱的语言功能–动态方法查找、鸭子类型、开放的类和通常情况下高度可变的runtime等这些功能在Objective-C中同样存在，即使那些不出名的技术也是一样。Objective-C的这些功能都要归功于它的IDE和编译器，但也是因为它们才使你不能自由地编写代码

---

#But wait, how can Objective-C be dynamic, given that it's built on C?

You can include all the C or C++ code you like in Objective-C, but that’s not to say that Objective-C is limited to C or C++ code. All of the interesting class manipulation and object introspection in the language comes from what’s called the Objective-C Runtime. The Objective-C runtime is comparable to the Ruby interpreter. It contains all the important elements necessary for highly-leveraged metaprogramming.

#但是等一下，怎么能说Objective-C是动态语言呢？难道它不是建立在C语言的基础上？

你可以在Objective-C代码中包含任何C或C++的代码，但这不意味着Objective-C仅限于C或C++代码。Objective-C中所有有意思的类操作和对象内省都是来自于一个叫Objective-C Runtime的东西。这个Objective-C Runtime可以和Ruby解释器相媲美。它包含了强大的元编程里所需要的所有重要特性。

---

Just like Ruby itself, these facilities are backed by real C, with methods like `property_getAttributes` or `method_getImplementation`, which do the hard work of mapping selectors to implementations (a selector is a handle to a method), determining if an object will respond to a selector, and traversing the subclass tree. The most important of all these methods is `objc_msgSend`, the C function that backs every single message-send in your app.

---

#Message in a bottle
Smalltalk was the first truly truly object-oriented programming language, in the sense that it replaced the notion of “calling functions” with the notion of “sending messages from one object to another.”

In Ruby, the way you do this is by writing:

```
receiver.the_message argument

```
And in Objective-C it's exactly the same:

```
[receiver theMessage:argument];

```
These messages enable duck-typing, meaning that the type or class of the object doesn't matter: all that matters is whether or not an object can respond to a message.

Sending messages is pretty cool, but its usefulness increases greatly as soon as the messages themselves start being passed around like data:

```
receiver.send(:the_message, argument)

```
and

```
[receiver performSelector:@selector(theMessage:) 

```

withObject:argument];
Just as methods in Ruby are backed by symbols, selectors in Objective-C are backed by strings. (We don't have symbols in Objective-C.) This allows you to pass a handle to a method around, and use it in a dynamic fashion. You can even build a selector from a string with `NSSelectorFromString`, and perform that on an object; this parallels building a string or a symbol in Ruby, and passing it to `Object#send`.

Of course, in either language, if you try to send a message that some object can’t respond to, the default behavior is to throw an exception, which will cause your app to crash.

If you need to check if an object will be able to perform a method before actually calling the method, you might use Ruby’s `respond_to?`:

```
if receiver.respond_to? :the_message
  receiver.the_message argument
end

```

Objective-C has something very similar:

```
if ([receiver respondsToSelector:@selector(theMessage:)]) {
    [receiver theMessage:someThing];
}

```
#Getting meta-er and meta-er

If you want to add methods to a class that you don’t control, such as a system class, Objective-C’s categories let you do exactly that — much like an “open class” in Ruby.

For example, if we wanted to add the `to_sentence` method from Rails, we could tack it onto `NSArray` pretty easily:

```

@interface NSArray (ToSentence)

- (NSString *)toSentence;

@end


@implementation NSArray (ToSentence)

- (NSString *)toSentence {
    if (self.count == 0) return @"";
    if (self.count == 1) return [self lastObject];
    NSArray *allButLastObject = [self subarrayWithRange:NSMakeRange(0, self.count-1)];
    NSString *result = [allButLastObject componentsJoinedByString:@", "];
    BOOL showComma = self.count > 2;
    result = [result stringByAppendingFormat:@"%@ and ", showComma ? @"," : @""];
    result = [result stringByAppendingString:[self lastObject]];
    return result;
}

@end

```
Categories add new methods at compile time — What about if you want to catch them dynamically at runtime?

Some messages can have data embedded within them, like Rails's dynamic finders. The Ruby implementation overrides `method_missing` and `respond_to`, matches the pattern, and adds a method definition to the object for the new method.

The flow in Objective-C is very similar, but instead of overriding `doesNotRecognizeSelector:` (which would be the analog to Ruby’s method_missing), we catch it in `resolveClassMethod:`. Assuming we had a class method called `+findWhere:equals:` that takes a property name and a value, it’s pretty easy to use a regular expression to find the property’s name, and register that selector with a block.

```

+ (BOOL)resolveClassMethod:(SEL)sel {
    NSString *selectorName = NSStringFromSelector(sel);

    NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:@"^findWhere(\\w+)Equals:$" options:0 error:nil];
    NSTextCheckingResult *result = [regex firstMatchInString:selectorName options:0 range:NSMakeRange(0, selectorName.length)];
    if (result) {
        NSRange propertyNameRange = [result rangeAtIndex:1];
        NSString *propertyName = [selectorName substringWithRange:propertyNameRange];

        IMP implementation  = imp_implementationWithBlock((id) ^(id self, id arg1) {
            return [self findWhere:propertyName equals:arg1];
        });

        Class metaClass = object_getClass(self);

        class_addMethod(metaClass, sel, implementation, "@@:@@");
        return YES;
    }

    return [super resolveClassMethod:sel];
}

```

The benefit of this technique is that we don’t need to override respondsToSelector:, since the method is fully registered with the class. We can now call [RGSong `findWhereTitleEquals:@“Mercy”]`. The first time `findWhereTitleEquals:` is called, the runtime can’t resolve the method, so it calls `resolveClassMethod:`, and we dynamically add the implementation. The second time, since it’s already added, won’t call `resolveClassMethod:`.

There are a few other ways to catch dynamic methods. You can (a) add a new implementation in `resolveClassMethod:` and `resolveInstanceMethod:` (as we did above), (b) forward the message to a different object, or (c) fully take over the "invocation" and do anything you wish to the message before passing it along. These methods each increase in cost, culminating in `-forwardInvocation:`, which has to instantiate an object to be performed. The default implementation of `-forwardInvocation:` is what actually calls `doesNotRecognizeSelector:`, which usually raises an exception and crashes the app.

#Introspection
Dynamic method resolution isn’t the only superpower of sick mutable languages like Ruby and Objective-C. You can also query your objects in order to manipulate them in interesting ways at runtime.

The same way you might use `MyClass#instance_methods` in Ruby, you can get a list of an object's methods in Objective-C with `class_copyMethodList([MyClass class], &numberOfMethods)`. You can get a list of the properties of a class with `class_copyPropertyList`, enabling you to do awesome introspection into your models. In the Rap Genius app, for instance, we use this facility to map JSON dictionaries to our local domain objects.

(If you love mixins in Ruby, the dynamic powers of Objective-C let you incorporate them too. Vladimir Mitrovic has a library called Objective-Mixin, which lets you copy implementations from one class to another class at runtime.)

#Cashing in

All of these dynamic tools are leveraged to build things like Core Data, which is a persistent object graph somewhat similar to ActiveRecord. In Core Data, relationships are “faulted”, which means they aren’t loaded until someone tries to access them. The accessors and mutators for each property are overridden at runtime (using the dynamic method resolution discussed above). If the object being accessed isn’t loaded yet, the framework will dynamically load that object from persistent store, and then return it. This keeps memory usage low, and prevents the entire object graph from being loaded into memory when any one object is fetched.

When a mutator for a Core Data entity is called, the framework can mark that object as dirty, without having to override every getter and setter for every property. Metaprogrammers, eat your heart out!

#What's a come-pie-lur?

But of course, Objective-C and Ruby aren't the same language. And by far the biggest difference is that Objective-C has a compiler.

This is the big caveat with all of these techniques. At compile time, the compiler checks to make sure that every selector that's mentioned in your app really exists within the app. If you’re dealing with an object that has type information, it will also check to make sure that that object declares that selector in its header file, preventing you from calling unknown selectors on objects. There are ways to get around these limitations, including just turning off the relevant compiler warnings. If you want to start writing more metaprogrammed Objective-C, this is a great place to start.

You can also remove the type information from objects by storing them as anonymous type, or `id`. Since the compiler doesn't know its type, it just assumes it can accept any messages your program sends to it (assuming that those messages are declared somewhere in your app and that the relevant compiler flag is turned on).

Fair warning: turning off compiler flags and storing objects as type `id` are both super dangerous! One of the best things about Objective-C (yes, better than metaprogramming) is the compiler. The type checking allows you to write and refactor code much faster and make fewer mistakes while doing it. Since no one else turns off these warnings, it would also be difficult to share your code. Most Objective-C developers would take stronger types over more metaprogramming.

So it turns out that Objective-C is more constricting — but only because we choose to make it so, with a compiler that adds lots of safety and speed.

The reality, though, is that these languages are cut from the same cloth, and a Rubyist should feel at home in Objective-C — even if the brackets scare you.