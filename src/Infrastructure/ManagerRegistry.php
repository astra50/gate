<?php

declare(strict_types=1);

namespace App\Infrastructure;

use function assert;
use Doctrine\Common\Persistence\ManagerRegistry as DoctrineManagerRegistry;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use function get_class;
use function is_object;
use LogicException;
use function str_replace;

/**
 * @author Konstantin Grachev <me@grachevko.ru>
 */
final class ManagerRegistry
{
    private DoctrineManagerRegistry $registry;

    public function __construct(DoctrineManagerRegistry $registry)
    {
        $this->registry = $registry;
    }

    /**
     * @psalm-param class-string $class
     */
    public function connection(string $class = null): Connection
    {
        return $this->getManager($class)->getConnection();
    }

    /**
     * @psalm-param class-string $class
     */
    public function getManager(string $class = null): EntityManagerInterface
    {
        $em = $this->managerOrNull($class);

        if (!$em instanceof EntityManagerInterface) {
            throw new LogicException('EntityManager expected');
        }

        return $em;
    }

    public function managerOrNull(string $class = null): ?EntityManagerInterface
    {
        $em = null === $class
            ? $this->registry->getManager()
            : $this->registry->getManagerForClass($this->class($class));

        if (null === $em) {
            return null;
        }

        assert($em instanceof EntityManagerInterface);

        return $em;
    }

    /**
     * @template T
     *
     * @psalm-param class-string<T> $class
     *
     * @psalm-return EntityRepository<T>
     */
    public function repository(string $class): EntityRepository
    {
        return $this->getManager($class)->getRepository($class);
    }

    /**
     * @param object|string $entity
     */
    public function class($entity): string
    {
        return is_object($entity)
            ? str_replace('Proxies\\__CG__\\', '', get_class($entity))
            : $entity;
    }
}
