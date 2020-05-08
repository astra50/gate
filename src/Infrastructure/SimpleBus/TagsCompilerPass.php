<?php

declare(strict_types=1);

namespace App\Infrastructure\SimpleBus;

use function array_shift;
use function assert;
use ReflectionClass;
use ReflectionParameter;
use function str_replace;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Finder\Finder;

final class TagsCompilerPass implements CompilerPassInterface
{
    /**
     * {@inheritdoc}
     */
    public function process(ContainerBuilder $container): void
    {
        $this->commands($container);
        $this->events($container);
    }

    private function commands(ContainerBuilder $container): void
    {
        $projectDir = $container->getParameter('kernel.project_dir');

        $handlers = (new Finder())
            ->in($projectDir.'/src/Application')
            ->files()
            ->name('*Handler.php');

        foreach ($handlers as $handler) {
            /** @var class-string $class */
            $class = 'App\\Application\\'.str_replace(['.php', '/'], ['', '\\'], $handler->getRelativePathname());
            $reflectionClass = new ReflectionClass($class);

            $definition = $container->getDefinition($reflectionClass->name);

            $reflectionMethod = $reflectionClass->getMethod('__invoke');

            $reflectionParameters = $reflectionMethod->getParameters();
            $reflectionParameter = array_shift($reflectionParameters);
            assert($reflectionParameter instanceof ReflectionParameter);
            $parameterReflectionClass = $reflectionParameter->getClass();
            assert($parameterReflectionClass instanceof ReflectionClass);

            $definition->addTag('command_handler', [
                'handles' => $parameterReflectionClass->getName(),
                'method' => '__invoke',
            ]);
        }
    }

    private function events(ContainerBuilder $container): void
    {
        $projectDir = $container->getParameter('kernel.project_dir');

        $handlers = (new Finder())
            ->in($projectDir.'/src/Ports/Messages')
            ->files()
            ->name('*Listener.php');

        foreach ($handlers as $handler) {
            /** @var class-string $class */
            $class = 'App\\Ports\\Messages\\'.str_replace(['.php', '/'], ['', '\\'], $handler->getRelativePathname());
            $reflectionClass = new ReflectionClass($class);

            $definition = $container->getDefinition($reflectionClass->name);

            $reflectionMethod = $reflectionClass->getMethod('__invoke');

            $reflectionParameters = $reflectionMethod->getParameters();
            $reflectionParameter = array_shift($reflectionParameters);
            assert($reflectionParameter instanceof ReflectionParameter);
            $parameterReflectionClass = $reflectionParameter->getClass();
            assert($parameterReflectionClass instanceof ReflectionClass);

            $definition->addTag('event_subscriber', [
                'subscribes_to' => $parameterReflectionClass->getName(),
            ]);
        }
    }
}
