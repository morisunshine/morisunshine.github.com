---
layout: post
title: "UICollectionView+UIKit Dynamics"
category: iOS
tags: [iOS, 技术]

---

本文有[morisunshine](www.morisunshine.com)译自[objc.io](http://www.objc.io/issue-5/collection-views-and-uidynamics.html),原文作者[Ash Furrow](https://twitter.com/ashfurrow)。转载请注明出处！

UIKit Dynamics 是iOS7中基于物理动画引擎的一个新特征--它被特别设计使其能很好地与collection Views配合工作，collection View首次在iOS6中被介绍。我们将进行一个将他们两个结合之旅。  

这篇文章将讨论两个实现了UIkit Dynamics的collection views的例子。第一个例子展示了如何去实现像iOS7里`Messages`应用中的弹力效果，然后进一步结合了有可伸缩效果的平铺机制。第二个例子展现了如何用UIKit Dynamics来模拟牛顿摆，事例可以一次被添加到collection view，然后相互作用。

在我们开始之前，我假定你们对`UICollectionView`是如何工作的有了基本的了解--查看[这篇objc.io博客](http://www.objc.io/issue-3/collection-view-layouts.html)会有你想要的所有细节。我也假定你已经理解了`UIKit Dynamics`的工作原理--阅读这篇[博客](http://www.teehanlax.com/blog/introduction-to-uikit-dynamics/)。

文章中的两个例子项目都已经在GitHub中:

- [ASHSpringyCollectionView](https://github.com/objcio/issue-5-springy-collection-view)(基于[UICollectionView Spring Demo](https://github.com/TeehanLax/UICollectionView-Spring-Demo))
- [Newtownian UICollectionView](https://github.com/objcio/issue-5-newtonian-collection-view)

#The Dynamic Animator

支持UICollectionView应用UIkit Dynamic的最关键部分就是UIDynamicAnimator。这个类是在UICollectionViewFlowLayout对象中，并且是被强引用的(有些人终究需要保持这个animator)。

当我们创建我们自己的dynamic animator，我们不会想平常一样，给它一个引用的试图。相反的，我们会用到需要collection view 布局作为参数的初始化程序。这很关键，当他的行为物理的属性应该被更新的时候，dynamic animator必须能够使collection view 布局无效。换句话说，dynamic animator 将会使布局无效。

我们将会很快看到事情是怎么连接起来的，但是在概念上理解collection view 如何与 dynamic animator相互作用是很重要的。collection view 布局将要在这个collection view 中的每个UICollectionViewLayoutAttributes对象添加行为(过会儿我们将讨论tiling这些)。将这些行为添加到dyamic animator之后，UIKit就会以查询这个collection view 布局属性的状态查询这个collection view 布局。与我们自己做大量计算相反，我们将返回这些被dynamic animator提供的物品。一旦animator的模拟状态发生改变，这个animator就会使这个布局无效。这会导致UIKit重新查询这个布局，并且一直循环到这个模拟静止。

所以重申一下，这个布局创建dynamic animator并且添加行为要与它每个物品中的布局属性相一致。当被问及布局信息时，它提供了由dynamic animator提供的信息。

#继承UICollectionViewFlowLayout

我们将要创建一个简单的例子来展示入如何使用带一个collection view 布局的UIkit Dynamic。我们需要做的第一件事就是，当然，一个数据源去驱动我们的collection view。我知道你聪明的可以提供自己的数据源，但是为了完整性，我还是提供了一个给你:

```objc

@implementation ASHCollectionViewController

static NSString * CellIdentifier = @"CellIdentifier";

-(void)viewDidLoad 
{
    [super viewDidLoad];
    [self.collectionView registerClass:[UICollectionViewCell class] 
            forCellWithReuseIdentifier:CellIdentifier];

}

-(UIStatusBarStyle)preferredStatusBarStyle 
{
    return UIStatusBarStyleLightContent;

}

-(void)viewDidAppear:(BOOL)animated 
{
    [super viewDidAppear:animated];
    [self.collectionViewLayout invalidateLayout];

}

#pragma mark - UICollectionView Methods

-(NSInteger)collectionView:(UICollectionView *)collectionView 
    numberOfItemsInSection:(NSInteger)section 
{
    return 120;

}

-(UICollectionViewCell *)collectionView:(UICollectionView *)collectionView 
                 cellForItemAtIndexPath:(NSIndexPath *)indexPath 
{
    UICollectionViewCell *cell = [collectionView 
        dequeueReusableCellWithReuseIdentifier:CellIdentifier 
                                  forIndexPath:indexPath];
    
    cell.backgroundColor = [UIColor orangeColor];
    return cell;

}

@end

```

注意到当试图被第一次出现的时候，这个布局是被无效的。这是因为没有用Storybards的结果(当使用Storyboards时，调用prepareLayout方法的时机是不同的--或是相同的--在WWDC的视频中他们没有告诉我们这些)。结果，一旦这些试图出现我们就需要手动使这个collection view 布局无效。当我们用tiling的时候，就不需要这样。

让我们创建我们的collection view 布局。我们需要一个指向dynamic animator的强引用，它将推动我们的collection view布局的属性。我们将有一个私有属性被定义在这个实现文件里:

```objc

@interface ASHSpringyCollectionViewFlowLayout ()

@property (nonatomic, strong) UIDynamicAnimator *dynamicAnimator;

@end

```

我们将在布局的初始化方法中初始我们的dynamic animator。还要设置一些属于父类UICollectionViewFlowLayout中的属性:

```objc

- (id)init 
{
    if (!(self = [super init])) return nil;
    
    self.minimumInteritemSpacing = 10;
    self.minimumLineSpacing = 10;
    self.itemSize = CGSizeMake(44, 44);
    self.sectionInset = UIEdgeInsetsMake(10, 10, 10, 10);
    
    self.dynamicAnimator = [[UIDynamicAnimator alloc] initWithCollectionViewLayout:self];
    
    return self;

}

```

我们将实现的下一个方法是prepareLayout。我们需要先调用父类的方法。因为我们是继承UICollectionViewFlowLayout，调用父类的prepareLayout将会为我们使collection view 布局属性都放置在合适的位置。我们现在可以依靠他们来排布并且要求所有的属性都在指定的范围内。让我们加载所有。

```objc

[super prepareLayout];

CGSize contentSize = self.collectionView.contentSize;
NSArray *items = [super layoutAttributesForElementsInRect:
    CGRectMake(0.0f, 0.0f, contentSize.width, contentSize.height)];

```

这真的是很没效率的代码。因为我们的collection view能够有成千上万个cell，一次性加载所有的cell会可能会导致难以置信的内存问题--频繁操作。我们要立刻遍历所有的元素，使这也成为耗时的操作。效率的双重打击！别担心--我们是负责任的开发者，所以我们会很快解决这个问题的。现在，我们继续简单的、朴素的实现方式。

加载完我们所有的collection view 布局属性之后，我们需要查看他们是否已经被加载到我们的animator里了。如果一个物品的行为已经在animator中存在，那么我么就不能重新添加，否则就会得到一个非常难懂的运行异常。

```objc

<UIDynamicAnimator: 0xa5ba280> (0.004987s) in 
<ASHSpringyCollectionViewFlowLayout: 0xa5b9e60> \{\{0, 0}, \{0, 0\}\}: 
body <PKPhysicsBody> type:<Rectangle> representedObject:
[<UICollectionViewLayoutAttributes: 0xa281880> 
index path: (<NSIndexPath: 0xa281850> {length = 2, path = 0 - 0}); 
frame = (10 10; 300 44); ] 0xa2877c0  
PO:(159.999985,32.000000) AN:(0.000000) VE:(0.000000,0.000000) AV:(0.000000) 
dy:(1) cc:(0) ar:(1) rs:(0) fr:(0.200000) re:(0.200000) de:(1.054650) gr:(0) 
without representedObject for item <UICollectionViewLayoutAttributes: 0xa3833e0> 
index path: (<NSIndexPath: 0xa382410> {length = 2, path = 0 - 0}); 
frame = (10 10; 300 44);

```

如果看到这个错误，那么这基本表明你添加了两个行为给同一个UICollectionViewLayoutAttributes，这导致了系统不知道该怎么处理。

无论如何，一旦我们已经检查好我们是否已经将行为添加到dynamic animator之后，我们就需要遍历每个collection view 布局属性来创建和添加新的dynamic behavior:

```objc

if (self.dynamicAnimator.behaviors.count == 0) {
	[items enumerateObjectsUsingBlock:^(id<UIDynamicItem> obj, NSUInteger idx, BOOL *stop) {
        UIAttachmentBehavior *behaviour = [[UIAttachmentBehavior alloc] initWithItem:obj 
                                                                    attachedToAnchor:[obj center]];
        
        behaviour.length = 0.0f;
        behaviour.damping = 0.8f;
        behaviour.frequency = 1.0f;
        
        [self.dynamicAnimator addBehavior:behaviour];
    
	}];

}

```

这段代码非常简单，我们为每个物品创建了一个以物品的中心为附着点的新UIAttachmentBehavior。然后又设置了我们的附着行为到零点的长度以便约束这个cell能一直以行为的附着点为中心。然后又设置阻尼和频率为这些值，这些值是我为了赏心悦目和不过份而实验性决定的。

这就是prepareLayout。我们现在需要实现两个方法，UIKit会调用它们来查询关于collection view 布局属性的布局，layoutAttributesForElementsInRect: 和 layoutAttributesForItemAtIndexPath:。我们的实现将会促进这些查询指向这个有专门设计的方法来响应这些查询的dynamic animator:

```objc

-(NSArray *)layoutAttributesForElementsInRect:(CGRect)rect 
{
    return [self.dynamicAnimator itemsInRect:rect];

}

-(UICollectionViewLayoutAttributes *)layoutAttributesForItemAtIndexPath:(NSIndexPath *)indexPath 
{
    return [self.dynamicAnimator layoutAttributesForCellAtIndexPath:indexPath];

}

```

#应对滚动事件

我们目前实现的代码将会提供一个正常滑动只有静态感觉的UICollectionView；运行起来没什么特别的。看上去很好，但是不是真的动态，不是么？

为了实现动态行为，我们需要我们布局和dynamic animator 能够对collection view 中的滑动位置的变化做出反应。幸好这里有个非常适合这个要求的方法shouldInvalidateLayoutForBoundsChange:。这个方法会在collection view 的边界发生改变的时候被调用，并且他提供了一个调整dynamic animator中的行为物品到一个新的content offset的时机。因为dynamic animator 会关心使我们的布局无效，但是在这种情况下，它不需要这么做:

```objc

-(BOOL)shouldInvalidateLayoutForBoundsChange:(CGRect)newBounds 
{
    UIScrollView *scrollView = self.collectionView;
    CGFloat delta = newBounds.origin.y - scrollView.bounds.origin.y;
    
    CGPoint touchLocation = [self.collectionView.panGestureRecognizer locationInView:self.collectionView];
    
    [self.dynamicAnimator.behaviors enumerateObjectsUsingBlock:^(UIAttachmentBehavior *springBehaviour, NSUInteger idx, BOOL *stop) {
        CGFloat yDistanceFromTouch = fabsf(touchLocation.y - springBehaviour.anchorPoint.y);
        CGFloat xDistanceFromTouch = fabsf(touchLocation.x - springBehaviour.anchorPoint.x);
        CGFloat scrollResistance = (yDistanceFromTouch + xDistanceFromTouch) / 1500.0f;
        
        UICollectionViewLayoutAttributes *item = springBehaviour.items.firstObject;
        CGPoint center = item.center;
	if (delta < 0) {
            center.y += MAX(delta, delta*scrollResistance);
        
	}
	else {
            center.y += MIN(delta, delta*scrollResistance);
        
	}
        item.center = center;
        
        [self.dynamicAnimator updateItemUsingCurrentState:item];
    
    }];
    
    return NO;

}

```

让我们仔细查看这个实现的细节。首先我们得到了这个scroll view(这是我们的collection view)，然后计算它的content offset中y的变化(在这个例子中，我们的collection view是垂直滑动的)。一旦我们得到这个增量，我们需要得到用户接触的位置。这是非常重要的，因为我们希望离接触位置比较近的那些物品能移动地更即时，而离接触位置比较远的那些物品则应该落后。


